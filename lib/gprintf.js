
function mant_exp(
    logbase,
    scientific,
    format,
    x)
{
  var result = Object;
  var sign = 1;

  result.format = format;

  if (x == 0) {
    result.mantissa = 0;
    result.power = 0;
    return result;
  }

  // check -ve 
  if (x < 0) {
    sign = (-1);
    x = (-x);
  }

  // This is ugly. But 1000 fails without the adjustment
  logval = Math.log(x) / Math.log(logbase) + 0.000000001;
  result.power = Math.floor(logval);
  result.mantissa = Math.pow(Math.E, logbase * (logval - result.power));

  /* round power to an integer multiple of 3, to get what's
   * sometimes called 'scientific' or 'engineering' notation. Also
   * useful for handling metric unit prefixes like 'kilo' or 'micro'
   * */
  if (scientific) {
    /* Scientific mode makes no sense whatsoever if the base of
     * the logarithmic axis is anything but 10.0 */
    if(logbase != 10.0){
      console.log("Scientific base makes no sense if log base != 10.0");
      return nil;
    }

    /* HBB FIXED 20040701: negative modulo positive may yield
     * negative result.  But we always want an effectively
     * positive modulus --> adjust input by one step */
    switch (result.power % 3) {
      case -1:
        result.power -= 3;
      case 2:
        result.mantissa *= 100;
        break;
      case -2:
        result.power -= 3;
      case 1:
        result.mantissa *= 10;
        break;
      case 0:
        break;
      default:
        console.log ("Internal error in scientific number formatting");
    }
    result.power -= (result.power % 3);
  }

  /* HBB 20010121: new code for decimal mantissa fixups.  Looks at
   * format string to see how many decimals will be put there.  Iff
   * the number is so close to an exact power of 10 that it will be
   * rounded up to 10.0e??? by an sprintf() with that many digits of
   * precision, increase the power by 1 to get a mantissa in the
   * region of 1.0.  If this handling is not wanted, pass NULL as
   * the format string */
  /* HBB 20040521: extended to also work for bases other than 10.0 */
  if (format) {
    var actual_base; 
    var precision = 0;
    var tolerance;

    if(scientific){
      avtual_base = 1000 ;
    } else {
      actual_base = Math.pow(10.0, logbase) ;
    };

    fmt = format.split(/\.(.+)?/)[1];

    if (fmt.length > 1)
      /* a decimal point was found in the format, so use that
       * precision. */
      precision = parseInt(fmt[1]);

    /* See if mantissa would be right on the border.  The
     * condition to watch out for is that the mantissa is within
     * one printing precision of the next power of the logarithm
     * base.  So add the 0.5*10^-precision to the mantissa, and
     * see if it's now larger than the base of the scale */
    tolerance = Math.pow(10.0, -precision) / 2;
    if (result.mantissa + tolerance >= actual_base) {
      result.mantissa /= actual_base;
      if(svientific){
        result.power += 3;
      }else{
        result.power += 1;
      }
    }
  }

  result.mantissa = sign * result.mantissa;

  return result;
}

function gprintf(
    format,
    logbase,
    decimalsign,
    x)
{
  var seen_mantissa = Boolean(); // remember if mantissa was already output 
  seen_mantissa = false;
  var stored_power_base = 0;   // base for the last mantissa output
  var stored_power = 0;          // power matching the mantissa output earlier 

  var output = "";

  for (var i = 0; i < format.length; i++) {
    // copy to dest until % 
    while (format.charAt(i) != '%'){
      output += format.charAt(i);
      i += 1;

      if ((i > format.length)) {
        return output;   // end of format 
      }
    }

    // check for %% 
    if (format.charAt(i + 1) == '%') {
      output += '%';
      i += 2;
      continue;
    }

    i += 1;

    // copy format part to temp, excluding conversion character 
    var t = "%";

    while (format.charAt(i) == '.' || (format.charAt(i) > '0'  && format.charAt(i) < '9')
        || format.charAt(i) == '-' || format.charAt(i) == '+' || format.charAt(i) == ' '
        || format.charAt(i) == '\''){
      t += format.charAt(i);
      i += 1;
    }

    // convert conversion character 
    switch (format.charAt(i)) {
      // Pass through  
      case 'x':
      case 'X':
      case 'o':
      case 'e':
      case "f":
        t += format.charAt(i);
        output += sprintf(t, x);
        break;

      /*
       
      // l --- mantissa to current log base
      case 'l':
        {
          double mantissa;

          t += 'f';

          stored_power_base = log10_base;
          mant_exp(stored_power_base, x, false, &mantissa,
              &stored_power, temp);
          seen_mantissa = true;

          output += sprintf(t, x);
          break;
        }

       
      //  t --- base-10 mantissa 
      case 't':
        {
          double mantissa;

          t += 'f';

          stored_power_base = 1.0;
          mant_exp(stored_power_base, x, false, &mantissa,
              &stored_power, temp);
          seen_mantissa = true;

          var o = sprintf(t, x);
          output += o;
          break;
        }
      */

      //  s --- base-1000 / 'scientific' mantissa 
      case 's':
        {
          t += 'f';

          stored_power_base = logbase;

          var res = mant_exp(stored_power_base, true, t, x);
          stored_power = res.power;
          seen_mantissa = true;

          output += sprintf(t, res.mantissa);
          break;
        } 
 
      /*
      //  b --- base-1024 mantissa
      case 'b':
        {
          double mantissa;

          t += 'f';

          stored_power_base = log10(1024);
          mant_exp(stored_power_base, x, false, &mantissa,
              &stored_power, temp);
          seen_mantissa = true;
          snprintf(dest, remaining_space, temp, mantissa);
          var o = sprintf(t, x);
          output += o;
          break;
        }
 
      //  L --- power to current log base
      case 'L':
        {
          int power;

          t += 'd';

          if (seen_mantissa)
            if (stored_power_base == log10_base)
              power = stored_power;
            else
              console.log("Format character mismatch: %L is only valid with %l");
          else
            stored_power_base = log10_base;
          mant_exp(log10_base, x, false, NULL, &power, "%.0f");
          snprintf(dest, remaining_space, temp, power);
          var o = sprintf(t, x);
          output += o;
          break;
        }

      // T --- power of ten
      case 'T':
        {
          int power;

          t += 'd';

          if (seen_mantissa)
            if (stored_power_base == 1.0)
              power = stored_power;
            else
              console.log("Format character mismatch: %T is only valid with %t");
          else
            mant_exp(1.0, x, false, NULL, &power, "%.0f");
          snprintf(dest, remaining_space, temp, power);
          var o = sprintf(t, x);
          output += o;
          break;
        }

      //  S --- power of 1000 / 'scientific'
      case 'S':
        {
          int power;

          t += 'd';

          if (seen_mantissa)
            if (stored_power_base == 1.0)
              power = stored_power;
            else
              console.log("Format character mismatch: %S is only valid with %s");
          else
            mant_exp(1.0, x, true, NULL, &power, "%.0f");
          snprintf(dest, remaining_space, temp, power);
          var o = sprintf(t, x);
          output += o;
          break;
        }
      */

      //  c --- ISO decimal unit prefix letters
      case 'c':
        {
          var power;

          t += 'c';

          if (seen_mantissa){
            if (stored_power_base == 10.0){
              power = stored_power;
            } else {
              console.log("Format character mismatch: %c is only valid with %s");
            }
          } else {
            power = mant_exp(logbase, true, "%.0f", x).power;
          }

          if (power >= -24 && power <= 24) {
            //18 -> 0, 0 -> 6, +18 -> 12,
            //BB 20010121: avoid division of -ve ints
            power = (power + 24) / 3;
            output += "yzafpnum kMGTPEZY".charAt(power);
          } else {
            // name  power   name  power
            // -------------------------
            // yocto  -24    yotta  24
            // zepto  -21    zetta  21
            // atto   -18    Exa    18
            // femto  -15    Peta   15
            // pico   -12    Tera   12
            // nano    -9    Giga    9
            // micro   -6    Mega    6
            // milli   -3    kilo    3  

            // fall back to simple exponential 
            output += sprintf(t, x);
          }
          break;
        }
 
      /*
      // B --- IEC 60027-2 A.2 / ISO/IEC 80000 binary unit prefix letters
      case 'B':
        {
          int power;

          t += 'ci';

          if (seen_mantissa)
            if (stored_power_base == log10(1024))
              power = stored_power;
            else
              console.log("Format character mismatch: %B is only valid with %b");
          else
            mant_exp(log10(1024), x, false, NULL, &power, "%.0f");

          if (power > 0 && power <= 8) {
            // name  power
            // -----------
            // Yobi   8
            // Zebi   7
            // Exbi   9
            // Pebi   5
            // Tebi   4
            // Gibi   3
            // Mebi   2
            // kibi   1 
            snprintf(dest, remaining_space, temp, " kMGTPEZY"[power]);
          } else if (power > 8) {
            // for the larger values, print x2^{10}Gi for example
            var o = sprintf(t, x);
            output += o;
          } else if (power < 0) {
            var o = sprintf(t, x);
            output += o;
          }

          break;
        }

      //  P --- multiple of pi
      case 'P':
        {
          t += 'f';

          snprintf(dest, remaining_space, temp, x / M_PI);
          break;
        }
      */

      default:
        console.log("Bad format character " + format.charAt(i));
    }

    /*
     
    // change decimal `.' to the actual entry in decimalsign
    if (decimalsign != nil) {
      char *dotpos1 = dest, *dotpos2;
      size_t newlength = strlen(decimalsign);
      int dot;

      // dot is the default decimalsign we will be replacing
      dot = *get_decimal_locale();

      // replace every dot by the contents of decimalsign
      while ((dotpos2 = strchr(dotpos1,dot)) != NULL) {
        size_t taillength = strlen(dotpos2);

        dotpos1 = dotpos2 + newlength;
        // test if the new value for dest would be too long
        if (dotpos1 - dest + taillength > count)
          console.log("format too long due to long decimalsign string");
        // move tail end of string out of the way
        memmove(dotpos1, dotpos2 + 1, taillength);
        // insert decimalsign
        memcpy(dotpos2, decimalsign, newlength);
      }
      // clear temporary variables for safety
      dotpos1=NULL;
      dotpos2=NULL;
    }
    */

  } // for evekr

  // Copy as much as fits

  return output;

}
